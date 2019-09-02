import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import composeMenu from 'utils/composeMenu'
interface IItemProps {
  code: string;
  id: number;
  parentId: number;
  url: string;
  other_url: string;
  name: string;
  children: Array<IItemProps>;
}

const renderMenuItem = <T extends IItemProps>(item: T): React.ReactNode => (
  <Menu.Item key={item.id || item.code || item.other_url} >
    <Link to={item.other_url || item.url} className="menu-link">
      {
        item.parentId === 0 ? <div className="menu-icon">
          <Icon type="pie-chart" />
        </div> : null
      }
      <span className="nav-text">{item.name}</span>
    </Link>
  </Menu.Item>
);

const renderSubMenu = <T extends IItemProps>(item: T): React.ReactNode => (
  <Menu.SubMenu key={item.id || item.code || item.other_url}
    popupClassName="sub-menu"
    title={
      <Fragment>
        {
          item.parentId === 0 ? <div className="menu-icon">
            <Icon type="pie-chart" />
          </div> : null
        }
        <span className="nav-text"> {item.name} </span>
      </Fragment>
    }>
    {item.children && item.children.map((item) => renderMenuItem(item))}
  </Menu.SubMenu>
);

export default () => {
  const menuList: string = localStorage.getItem('cxt_menu_list') || ''
  const menu = JSON.parse(menuList) || []
  const menus = composeMenu(menu)
  return (
    <Menu mode="horizontal" theme="dark">
      {menus && menus.map(item => (item.children && item.children.length ? renderSubMenu<IItemProps>(item) : renderMenuItem<IItemProps>(item)))}
    </Menu>
  )
}
