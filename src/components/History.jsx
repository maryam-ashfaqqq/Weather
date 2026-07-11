function History({ history, setCity, getWeather }) {

  if (history.length === 0) {
    return (
      <div className="history">
        <h3>Recent Searches</h3>
        <p>No recent searches</p>
      </div>
    );
  }


  return (

    <div className="history">

      <h3>
        Recent Searches
      </h3>


      <ul>

        {history.map((item) => (

          <li
            key={item}
            onClick={() => {
              setCity(item);
              getWeather(item);
            }}
          >
            📍 {item}
          </li>

        ))}

      </ul>

    </div>

  );

}


export default History;