export default {
  workUsers: {
    data: [],
    total: 0
  },
  usersSearch: {
    reg_date_b: '',
    reg_date_e: '',
    create_time_b: '',
    create_time_e: '',
    recent_time_b: '',
    recent_time_e: '',
    uni_query: '',
    biz_status: '',
    page: 1,
    pageSize: 40,
  },
  getUserLoading: false,
  currentUser: null,
  wechtMessageInfo: {
    data: [],
    limit: 10,
    offset: 1,
    finished: false,
  },
  sendShow: false,
  socket: null,
  workCount: {
    "todoDetail": {
      "phoneTaskCounter": 0,
      "todayAppointCounter": 0,
      "todayFollowUpCounter": 0,
      "todayNewCounter": 0,
      "untreatedCounter": 0
    },
    "todoPre": [
      {
        "counter": 0,
      },
      {
        "counter": 0,
      },
      {
        "counter": 0,
      },
      {
        "counter": 0,
      },
      {
        "counter": 0,
      },
      {
        "counter": 0,
      },
      {
        "counter": 0,
      }
    ]
  }
}
