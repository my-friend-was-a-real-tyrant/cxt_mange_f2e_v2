import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd';
import composeMenu from 'utils/composeMenu'
interface IItemProps {
  code: string;
  id: number;
  parentId: number;
  url: string;
  name: string;
  children: Array<IItemProps>;
}

const renderMenuItem = <T extends IItemProps>(item: T): React.ReactNode => (
  <Menu.Item key={item.id || item.code || item.url} >
    <Link to={item.url}>
      <span className="nav-text">{item.name}</span>
    </Link>
  </Menu.Item>
);

const renderSubMenu = <T extends IItemProps>(item: T): React.ReactNode => (
  <Menu.SubMenu key={item.id || item.code || item.url} title={
    <span className="nav-text">{item.name}</span>
  }>
    {item.children && item.children.map((item) => renderMenuItem(item))}
  </Menu.SubMenu>
);

export default () => {
  const menuList: string = localStorage.getItem('cxt_menu_list') || ''
  const menu = JSON.parse(menuList) || []
  const menus = composeMenu(menu)
  return (
    <Menu mode="horizontal">
      {menus && menus.map(item => (item.children && item.children.length ? renderSubMenu<IItemProps>(item) : renderMenuItem<IItemProps>(item)))}
    </Menu>
  )
}