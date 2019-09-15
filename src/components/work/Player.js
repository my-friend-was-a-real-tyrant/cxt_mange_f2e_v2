import React, {PureComponent} from 'react';
import {Icon, Slider} from 'antd';
import ReactPlayer from 'react-player'
import 'assets/styles/player.less'

class Player extends PureComponent {
  state = {
    isPlay: false,
    width: 0,
    time: 0,
    atime: 0,
    duration: 0,
    changeBoolean: false,
    volume: 100,
    fileUrl: this.props.fileUrl,
    value: 0,
  }

  times = (times) => {
    var second = Math.floor(times % 60);
    second = second < 10 ? ("0" + second) : second;
    var minute = Math.round((times - second) / 60);
    minute = minute < 10 ? ('0' + minute) : minute;
    return minute + ':' + second;
  }

  player = () => {
    this.setState({
      isPlay: !this.state.isPlay,
    }, () => {
      console.log(this.state.isPlay)
    })

  }

  onProgress = (state) => {
    this.setState({
      width: state.played,
      atime: parseInt(state.playedSeconds)
    })
  }

  onDuration = (state) => {
    this.setState({
      duration: parseInt(state),
      time: this.times(state)
    })
  }

  handleDurationMove = (e) => {
    this.refs.player.seekTo(e)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.fileUrl !== nextProps.fileUrl) {
      this.setState({
        isPlay: false
      })
    }
  }

  componentWillUnmount() {
    console.log('组件销毁', this)
    this.setState({
      isPlay: false,
    })
  }

  download = (fileUrl) => {
    window.location.href = fileUrl
  }

  render() {
    const {isPlay, time, duration, atime} = this.state;
    const {fileName, fileUrl,} = this.props;
    console.log(fileUrl)
    return (
      <div className="player-wrapper">
        <div className="img">
          {isPlay ?
            <div className="pause" onClick={() => this.player()}>

            </div> :
            <div className="play" onClick={() => this.player()}>

            </div>}
        </div>
        <div className="slider">
          <Slider min={0} max={parseInt(duration)} value={atime} onChange={e => this.handleDurationMove(e)}/>
        </div>
        {/*{*/}
        {/*  fileUrl.indexOf('null') !== -1 ? <a href={fileUrl} download={fileUrl}>*/}
        {/*    <Icon type="download" style={{color: '#1890ff'}}/>*/}
        {/*  </a> : <Icon type="download" style={{color: '#1890ff'}}/>*/}
        {/*}*/}
        {
          fileUrl.indexOf('null') === -1 ? <ReactPlayer url={fileUrl}
                                                        controls
                                                        playing={this.state.isPlay}
                                                        volume={this.state.volume / 100}
                                                        style={{display: 'none'}}
                                                        ref="player"
                                                        onDuration={this.onDuration}
                                                        onProgress={this.onProgress}/> : null
        }
      </div>
    )
  }
}

export default Player
