import constants from "../constants/work"

const initState = {
  workUsers: {
    data: [],
    total: 0
  },
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
    default:
      return previousState;
  }
};

export default common
