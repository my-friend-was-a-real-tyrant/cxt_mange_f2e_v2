import fetch from 'fetch/axios'

const service = {
  getUser(): Promise<Array<object>> {
    return new Promise((resolve, reject) => {
      fetch.get(`/apiv1/otb/seatmanagement/seat/listForSelByAccountId`).then((res: any) => {
        if (res.code === 20000) {
          resolve(res.data)
        } else {
          reject()
        }
      })
    })
  }
}

export default service
