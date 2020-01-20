const Machines = function(props) {
  return (
    <React.Fragment>
      <div id="machine1" className="col-4">
        <div className="card">
          <div className="card-header">
            <h5>Machine 1</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Capabilities: 'grinding', 'coating'</li>
            <li id="machine1status" className="list-group-item">Status: active</li>
            <li id="machine1balance" className="list-group-item">Balance: 0</li>
            <li id="machine1wearOffLevel" className="list-group-item">Tool wear level: 0</li>
            <li id="machine1toolingTimes" className="list-group-item">Tooling times: 0</li>
          </ul>
        </div>
      </div>

      <div id="machine2" className="col-4">
        <div className="card">
          <div className="card-header">
            <h5>Machine 2</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Capabilities: 'grinding', 'case-hardening'</li>
            <li id="machine2status" className="list-group-item">Status: active</li>
            <li id="machine2balance" className="list-group-item">Balance: 0</li>
            <li id="machine2wearOffLevel" className="list-group-item">Tool wear level: 0</li>
            <li id="machine2toolingTimes" className="list-group-item">Tooling times: 0</li>
          </ul>
        </div>
      </div>

      <div id="machine3" className="col-4">
        <div className="card">
          <div className="card-header">
            <h5>Machine 3</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Capabilities: 'coating', 'case-hardening'</li>
            <li id="machine3status" className="list-group-item">Status: active</li>
            <li id="machine3balance" className="list-group-item">Balance: 0</li>
            <li id="machine3wearOffLevel" className="list-group-item">Tool wear level: 0</li>
            <li id="machine3toolingTimes" className="list-group-item">Tooling times: 0</li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

ReactDOM.render(
  <Machines />,
  document.getElementById('machines')
);
