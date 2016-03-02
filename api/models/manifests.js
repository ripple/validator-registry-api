'use strict';
import addressCodec from 'ripple-address-codec'
import elliptic from 'elliptic'
const Ed25519 = elliptic.eddsa('ed25519')

const MAX_SEQUENCE = 4294967295

// Store a map of ephemeral to master public keys for quick lookup
// to check each incoming validation for a known master public key.
let master_keys = {}

function clearCache() {
  master_keys = {}
}

function deleteKey(ephemeral_public_key) {
  delete master_keys[ephemeral_public_key]
}

function getKey(ephemeral_public_key) {
  return master_keys[ephemeral_public_key]
}

function setKey(ephemeral_public_key, master_public_key) {
  master_keys[ephemeral_public_key] = master_public_key
}

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
      getEphemeralKey: async function(master_public_key) {
        const manifest = await this.findOne({
          where: {
            master_public_key: master_public_key
          },
          order: [['sequence', 'DESC']],
          raw: true
        })
        return manifest && manifest.sequence<MAX_SEQUENCE ?
                manifest.ephemeral_public_key : null
      },
      getMasterKey: function(ephemeral_public_key) {
        return getKey(ephemeral_public_key)
      },
      loadCache: async function() {
        clearCache()
        const db_master_keys = await this.aggregate('master_public_key', 'DISTINCT', {
          plain: false
        })
        for (let distinct_master_key of db_master_keys) {
          const master_key = distinct_master_key['DISTINCT']
          const ephemeral_key = await this.getEphemeralKey(master_key)
          if (ephemeral_key) {
            setKey(ephemeral_key, master_key)
          }
        }
      },
      associate: function(models) {
        // associations can be defined here
      },
    }
  });

  Manifests.afterCreate(async function(manifest, options, fn) {

    // Check if this revokes previous ephemeral keys or the master key itself
    if (manifest.sequence>=MAX_SEQUENCE) {

      // Update cache
      const ephemeral_key = this.getEphemeralKey(manifest.master_public_key)
      if (ephemeral_key) {
        deleteKey(ephemeral_key)
      }
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
    if (!active_manifest) {

      // Add new master key to cache
      setKey(manifest.ephemeral_public_key, manifest.master_public_key)
    } else if (active_manifest.sequence<manifest.sequence) {

      // Update cache
      setKey(manifest.ephemeral_public_key, manifest.master_public_key)
      deleteKey(active_manifest.ephemeral_public_key)
    }
    fn(null, manifest)
  })

  Manifests.afterBulkDestroy(async function(manifests, fn) {
    if (manifests.truncate) {
      clearCache()
    }
    fn(null, manifests)
  })

  return Manifests;
};