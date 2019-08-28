import constants from "../constants/common"

const initState = {
  menuList: [],
}

interface IActionProps {
  type: string;
  value: any;
}

type retunType = typeof initState;

const common = (previousState = initState, action: IActionProps): retunType => {
  switch (action.type) {
    case constants.SET_MENU_LIST:
      return {...previousState, menuList: action.value}
    default:
      return previousState;
  }
};

export default common