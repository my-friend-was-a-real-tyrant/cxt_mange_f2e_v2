/*
 * @Author: sunyonghua
 * @Date: 2019-08-29 15:06:15
 * @Description: 组合菜单项
 */
interface IItemAttr {
  code: string;
  id: number;
  parentId: number;
  url: string;
  status: number;
  other_url: string;
  name: string;
  children: Array<IItemAttr>;
}
const composeMenu = <T extends IItemAttr>(treeData: T[], parentId: number): T[] => {
  if (!treeData || !treeData.length) return [];

  let result: T[] = []
  let children: T[] = [];

  for (let i = 0, len = treeData.length; i < len; i++) {
    let item: T = treeData[i];
    if (item.parentId === parentId && item.status === 1) {
      children = composeMenu(treeData, item.id);
      if (children.length > 0) {
        item.children = children
      }
      result.push(item);
    }
  }
  return result;
}

export default (menu: Array<IItemAttr>) => composeMenu<IItemAttr>(menu, 0)
