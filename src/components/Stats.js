import React from "react";
import Carousel from "react-bootstrap/Carousel";

const Stats = ({ stats }) => {
  return (
    <>
      <div className="container-table">
        <Carousel pause="hover">
          <Carousel.Item>
            <div className="row">
              <div className="col-md-12">
                <table className="styled-table ">
                  <thead>
                    <tr>
                      <th className="header-cell">Position</th>
                      <th className="header-cell-team">Team</th>
                      <th className="header-cell">Played Games</th>
                      <th className="header-cell">Form</th>
                      <th className="header-cell">Won</th>
                      <th className="header-cell">Draw</th>
                      <th className="header-cell">Lost</th>
                      <th className="header-cell">Points</th>
                      <th className="header-cell">Goals For</th>
                      <th className="header-cell">Goals Against</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.standings.map((stat, index) => (
                      <tr
                        key={stat.position}
                        className="table-row"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "rgba(23, 255, 121, 0.2)"
                              : index >= 1 && index <= 3
                              ? "rgba(0, 0, 255, 0.1)"
                              : index >= 17 && index <= 19
                              ? "rgba(255, 0, 0, 0.1)"
                              : "inherit",
                        }}
                      >
                        <td>{stat.position}</td>
                        <td className="team-cell">
                          <img
                            className="team-crest mr-2"
                            src={stat.team.crest}
                            alt={stat.team.name}
                          />
                          {stat.team.name}
                        </td>
                        <td>{stat.playedGames}</td>
                        <td>
                          {stat.form.split(",").map((formItem, index) => {
                            let borderColor;
                            switch (formItem) {
                              case "D":
                                borderColor = "yellow";
                                break;
                              case "W":
                                borderColor = "limegreen";
                                break;
                              case "L":
                                borderColor = "red";
                                break;
                              default:
                                borderColor = "transparent";
                                break;
                            }
                            return (
                              <span
                                key={index}
                                style={{
                                  display: "inline-block",
                                  width: "1.2em",
                                  height: "1.2em",
                                  borderRadius: "50%",
                                  border: `2px solid ${borderColor}`,
                                  backgroundColor: "white",
                                  textAlign: "center",
                                  lineHeight: "1.2em",
                                  color: "white",
                                }}
                              >
                                {formItem}
                              </span>
                            );
                          })}
                        </td>
                        <td>{stat.won}</td>
                        <td>{stat.draw}</td>
                        <td>{stat.lost}</td>
                        <td>{stat.points}</td>
                        <td>{stat.goalsFor}</td>
                        <td>{stat.goalsAgainst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="row">
              <div className="col-md-12">
                <table className="styled-table-players">
                  <thead>
                    <tr>
                      <th className="header-cell">Player Name</th>
                      <th className="header-cell">Team</th>
                      <th className="header-cell">Goals</th>
                      <th className="header-cell">Assists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.scorers.map((scorer, index) => (
                      <tr key={index}>
                        <td>{scorer.playerName}</td>
                        <td>
                          <img
                            className="team-crest-scorers"
                            src={scorer.team.crest}
                          ></img>
                        </td>
                        <td>{scorer.goals}</td>
                        <td>{scorer.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
};

export default Stats;
