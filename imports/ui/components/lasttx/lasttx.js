import './lasttx.html'

const renderLastTxBlock = () => {
  Meteor.call('lasttx', (err, res) => {
    // The method call sets the Session variable to the callback value
    if (err) {
      Session.set('lasttx', { error: err })
    } else {
      const tx = []
      res.transactions.forEach((index) => {
        const obj = index
        obj.amount = parseFloat(obj.amount)
        tx.push(obj)
      })
      res.transactions = tx
      Session.set('lasttx', res)
    }
  })
}

Template.lasttx.onCreated(() => {
  Session.set('lasttx', {})
  renderLastTxBlock()
})

Template.lasttx.helpers({
  lasttx() {
    return Session.get('lasttx')
  },
  amount() {
    if (this.tx.coinbase) {
      // FIXME: We need a unified way to format Quantas
      return this.tx.coinbase.amount * 1e-8
    }
    if (this.tx.transfer) {
      // FIXME: We need a unified way to format Quantas
      return this.tx.transfer.amount * 1e-8
    }
    return ''
  },
  tx_hash() {
    return Buffer.from(this.tx.transaction_hash).toString('hex')
  },
  block() {
    return this.header.block_number
  },
  ts() {
    const x = moment.unix(this.header.timestamp.seconds)
    return moment(x).format('HH:mm D MMM YYYY')
  },
  zeroCheck() {
    const x = Session.get('lasttx')
    return x.length === 0
  },
})

Template.lasttx.events({
  'click .refresh': () => {
    renderLastTxBlock()
  },
  'click .close': () => {
    $('.message').hide()
  },
})
