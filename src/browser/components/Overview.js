const Overview = function() {
  return (
    <div>
      <div id="networkVis" className="my-1"></div>
      <button id="startSessionBtn">Send task</button>
    </div>
  )
}

ReactDOM.render(
  <Overview/>,
  document.getElementById('overview')
);
