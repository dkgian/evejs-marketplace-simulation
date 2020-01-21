const Machines = function(props) {
  return (
    <React.Fragment>
      <div id="machine1-card" className="card">
        <div className="card-header">
          <h5>Machine 1</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Capabilities: 'grinding', 'coating'</li>
          <li id="machine1status" className="list-group-item">Status: --- </li>
          <li id="machine1balance" className="list-group-item">Balance: --- </li>
          <li id="machine1wearOffLevel" className="list-group-item">Tool wear level: --- </li>
          <li id="machine1toolingTimes" className="list-group-item">Tooling times: --- </li>
        </ul>
      </div>

      <div  id="machine2-card" className="card">
        <div className="card-header">
          <h5>Machine 2</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Capabilities: 'grinding', 'case-hardening'</li>
          <li id="machine2status" className="list-group-item">Status: ---</li>
          <li id="machine2balance" className="list-group-item">Balance: ---</li>
          <li id="machine2wearOffLevel" className="list-group-item">Tool wear level: ---</li>
          <li id="machine2toolingTimes" className="list-group-item">Tooling times: ---</li>
        </ul>
      </div>

      <div  id="machine3-card" className="card">
        <div className="card-header">
          <h5>Machine 3</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Capabilities: 'coating', 'case-hardening'</li>
          <li id="machine3status" className="list-group-item">Status: ---</li>
          <li id="machine3balance" className="list-group-item">Balance: ---</li>
          <li id="machine3wearOffLevel" className="list-group-item">Tool wear level: ---</li>
          <li id="machine3toolingTimes" className="list-group-item">Tooling times: ---</li>
        </ul>
      </div>

      <div id="summary-card" className="card flex-fill">
        <div className="card-header">
          <h5>Summary</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li id="marketBalance" className="list-group-item">Balance: ---</li>
          <li id="marketToolingTimes" className="list-group-item">Tooling times: ---</li>
        </ul>
      </div>
    </React.Fragment>
  )
}

ReactDOM.render(
  <Machines />,
  document.getElementById('machines')
);
