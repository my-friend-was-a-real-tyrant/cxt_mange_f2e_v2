/**
 * 可编辑的Table单元格
 */
import React from 'react'
import { Form, Input } from 'antd'

const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  state = {
    editing: false
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  componentWillMount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  handleClickOutside = (e) => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save()
    }
  }

  save = () => {
    const { record, handleSave } = this.props

    this.form.validateFields((error, values) => {
      if (error) {
        return
      }
      this.toggleEdit()
      console.log('values', values)
      handleSave({ ...record, ...values })
    })
  }

  render() {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props

    // console.log('可编辑单元格props: ', this.props)

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form

              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      initialValue: record[dataIndex]
                    })(<Input
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                    />
                    )}
                  </FormItem>
                ) : (
                    <div style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
                      {record[dataIndex] && record[dataIndex].replace(/ /g, '') ? record[dataIndex] : '无'}
                    </div>
                  )
              )
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    )
  }
}

export {
  EditableCell,
  EditableFormRow
}