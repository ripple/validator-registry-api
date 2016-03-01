'use strict';
import addressCodec from 'ripple-address-codec';
import elliptic from 'elliptic'
const Ed25519 = elliptic.eddsa('ed25519');

module.exports = function(sequelize, DataTypes) {
  var Manifests = sequelize.define('Manifests', {
    ephemeral_public_key: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i,
          msg: 'Invalid ephemeral_public_key'
        }
      }
    },
    master_public_key: {
      type     : DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^n([rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]){51}$/i,
          msg: 'Invalid master_public_key'
        }
      }
    },
    sequence: {
      type     : DataTypes.BIGINT,
      allowNull: false
    },
    signature: {
      type     : DataTypes.STRING,
      allowNull: false
    },
    revoked: {
      type     : DataTypes.BOOLEAN
    },
    createdAt: {
      type     : DataTypes.DATE
    },
  }, {
    validate: {
      verifySignature: function() {
        if (!this.master_public_key || !this.ephemeral_public_key ||
            !this.sequence || !this.signature) return
        const sfSequence = '$'
        const sfPublicKey = 'q'
        const sfSigningPubKey = 's'

        // Form manifest
        let sequence_buf = new Buffer(4)
        sequence_buf.writeUInt32BE(this.sequence)
        const sequence_bytes = sequence_buf.toJSON().data

        let master_public_bytes = addressCodec.decodeNodePublic(this.master_public_key)
        const ephemeral_public_bytes = addressCodec.decodeNodePublic(this.ephemeral_public_key)
        const signature_bytes = new Buffer(this.signature, 'hex').toJSON().data

        let manifest = new Buffer('MAN\0').toJSON().data
        manifest = manifest.concat(new Buffer(sfSequence).toJSON().data,
                                   sequence_bytes,
                                   new Buffer(sfPublicKey).toJSON().data,
                                   [master_public_bytes.length],
                                   master_public_bytes,
                                   new Buffer(sfSigningPubKey).toJSON().data,
                                   [ephemeral_public_bytes.length],
                                   ephemeral_public_bytes)

        master_public_bytes.shift()
        if (!Ed25519.verify(manifest, signature_bytes, master_public_bytes)) {
          throw new Error('Manifest has invalid signature')
        }
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
    }
  });

  Manifests.master_keys = {}
  Manifests.ephemeral_keys = {}

  Manifests.afterCreate(async function(manifest, options, fn) {
    const MAX_SEQUENCE = 4294967295

    // Check if this revokes previous ephemeral keys or the master key itself
    if (manifest.sequence>=MAX_SEQUENCE) {

      // Update cache
      const ephemeral_key = this.ephemeral_keys[manifest.master_public_key]
      if (ephemeral_key) {
        delete this.master_keys[ephemeral_key]
      }
      delete this.ephemeral_keys[manifest.master_public_key]

      // New manifest revokes master public key
      await this.update({
        revoked: true
      }, {
        fields: ['revoked'],
        where: {
          master_public_key: manifest.master_public_key
        }
      })
      return fn(null, manifest)
    }

    const active_manifest = await this.findOne({
      where: {
        master_public_key: manifest.master_public_key,
        $not: {
          id: manifest.id
        }
      },
      order: [['sequence', 'DESC']]
    })
    if (active_manifest) {
      if (active_manifest.sequence>=manifest.sequence) {

        // Revoke new manifest
        await manifest.update({
          revoked: true
        })
      } else {

        // Update cache
        this.master_keys[manifest.ephemeral_public_key] = manifest.master_public_key
        this.ephemeral_keys[manifest.master_public_key] = manifest.ephemeral_public_key
        delete this.master_keys[active_manifest.ephemeral_public_key]

        // Revoke previous manifest
        await active_manifest.update({
          revoked: true
        })
      }
    } else {

      // Add new master key to cache
      this.master_keys[manifest.ephemeral_public_key] = manifest.master_public_key
      this.ephemeral_keys[manifest.master_public_key] = manifest.ephemeral_public_key
    }
    fn(null, manifest)
  })

  return Manifests;
};