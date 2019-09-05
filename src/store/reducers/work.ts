import constants from "../constants/work"

const initState = {
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
    pageSize: 16,
  },
  getUserLoading: false,
}

interface IActionProps {
  type: string;
  value: any;
}

type retunType = typeof initState;

const common = (previousState = initState, action: IActionProps): retunType => {
  switch (action.type) {
    case constants.SET_WORK_USERS:
      return {...previousState, workUsers: action.value}
    case constants.SET_USERS_SEARCH:
      return {...previousState, usersSearch: action.value}
    case constants.SET_USER_LOADING:
      return {...previousState, getUserLoading: action.value}
    default:
      return previousState;
  }
};

export default common
