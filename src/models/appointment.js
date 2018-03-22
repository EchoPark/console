export default {
  namespace: 'appointment',
  state: {
    // TODO
  },
  subscriptions: {
    setup ({ history }) {
      return history.listen(({ pathname, query }) => {
        if (query.code) {
          window.localStorage.setItem('wxCode', query.code)
        }
      })
    }
  }
}
