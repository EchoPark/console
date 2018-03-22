const CalendarHeader = props => {
  return (
    <div className='calendarHeader'>
      <span className='prev' onClick={props.prevMonth}>《</span>
      <span className='next' onClick={props.nextMonth}>》</span>
      <span className='dateInfo'>{this.props.year}年{this.props.month + 1}月</span>
    </div>
  )
}

export default CalendarHeader
