### 开发规范
  - 注释
    - 组件文件头部需添加注释
    - ```typescript
      /*
       * @Author: sunyonghua
       * @Date: 2019-08-26 16:10:04
       * @Description: 登录界面
       */
      ```
    - 方法注释
    - ```typescript
      //提交登录
      const handleSubmit=()=>{
        // ...do something
      }
      ```
    - 变量注释同上，根据情况而加
  - 引用组件顺序
    - 先引用外部组件库,,再引用当前组件块级组件, 然后是 common 里的公共函数库最后是 css 样式
    - ```typescript
        import * as React from 'react';
        import { Dropdown, Menu, Icon } from 'antd';
        import Header from './Header';
        import toast from 'common/toast';
        import './index.less';
       ```
  - 引号
    - 单引号或者反引号
  - 命名
    - 文件名：大驼峰式风格，LoginForm.tsx
    - 类名: 类名同文件名，大驼峰式风格，字母和数字，例如：AbcTest。禁止汉字、特殊符号，禁止非大驼峰式风格。
    - 函数名: 小驼峰式风格，字母和数字，例如：abcTest。禁止汉字、特殊符号，禁止非小驼峰式风格，例如snake_case等。
    - 变量名: 同函数名。
    - 常量: 全大写风格，大写字母、数字和下划线，单词之间以下划线分隔，例如：ABC_TEST。禁止汉字、特殊符号、小写字母。
    - 使用 onXxx 形式作为 props 中用于回调的属性名称。
    - 组件内的事件函数使用 handle 开头尾,handleCheckBtn。
    - 使用 withXxx 形式的词作为高阶组件的名称。
    - 接口命名前面带上 I 表示 interface