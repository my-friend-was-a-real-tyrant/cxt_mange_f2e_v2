import React, {FunctionComponent, useState} from 'react'
import {Modal, Row, Col, Card, Statistic} from 'antd'
import moment from 'moment'
import {connect} from 'react-redux'

interface IProps {
  workCount: any;
}

const WorkFixed: FunctionComponent<IProps> = (props) => {
  const {workCount} = props;
  const [workShow, setWorkShow] = useState<boolean>(false)
  return (
    <div className="work-fixed">
      <div className="work-fixed__task" onClick={() => setWorkShow(true)}>
        工作安排
      </div>
      <div className="work-fixed__phone">
        电话拨号
      </div>

      <Modal title="我的工作安排"
             visible={workShow}
             onCancel={() => setWorkShow(false)}
             footer={null}
             width={600}
             className="work-info">
        <Row gutter={24}>
          <Col span={5}>
            <Card className="fixed-task__count" bordered={false}>
              <Statistic title="总电话任务" value={workCount['count']}/>
            </Card>
          </Col>
          <Col span={5} >
            <Card className="fixed-task__today_call"  bordered={false}>
              <Statistic title="今日待跟进" value={workCount['today_call']}/>
            </Card>
          </Col>
          <Col span={5} >
            <Card className="fixed-task__today_count"  bordered={false}>
              <Statistic title="今日已跟进" value={workCount['today_count']}/>
            </Card>
          </Col>
          <Col span={5} >
            <Card className="fixed-task__wait"  bordered={false}>
              <Statistic title="待呼叫" value={workCount['wait']}/>
            </Card>
          </Col>
          <Col span={4} >
            <Card className="fixed-task__today_add"  bordered={false}>
              <Statistic title="今日新增" value={workCount['today_add']}/>
            </Card>
          </Col>
        </Row>
        <h5>未来一周待跟进：</h5>
        <Row gutter={24} className="week">
          {
            [1, 2, 3, 4, 5, 6].map((v, i) => <Col span={4} key={i}>
              <Card bordered={false}>
                <Statistic title={moment().add(v, 'days').format('MM/DD')} value={workCount[`today_call_${v}`]}/>
              </Card>
            </Col>)
          }
        </Row>
      </Modal>
    </div>
  )
}
const mapStateToProps = (state: any) => ({
  workCount: state.work.workCount
})
export default connect(mapStateToProps)(WorkFixed)
