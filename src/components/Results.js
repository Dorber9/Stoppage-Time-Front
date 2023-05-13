import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import LaLigaIcon from "../utils/laliga.png";

const Results = ({ data }) => {
  // Group matches by date
  const groupedMatches = data.results.reduce((grouped, match) => {
    const matchday = match.matchday;
    if (!grouped[matchday]) {
      grouped[matchday] = [];
    }
    grouped[matchday].push(match);
    return grouped;
  }, {});

  // Get list of matchdays
  const matchdays = Object.keys(groupedMatches).sort((a, b) => a - b);

  // Set initial matchday to first matchday
  const [currentMatchday, setCurrentMatchday] = useState(matchdays[0]);
  const [team, setTeam] = useState("");
  const [matches, setMatches] = useState(groupedMatches);

  useEffect(() => {
    if (team) {
      // Filter matches by selected team
      const filteredMatches = data.results.filter(
        (match) => match.homeTeam === team || match.awayTeam === team
      );

      // Group filtered matches by date
      const filteredGroupedMatches = filteredMatches.reduce(
        (grouped, match) => {
          const matchday = match.matchday;
          if (!grouped[matchday]) {
            grouped[matchday] = [];
          }
          grouped[matchday].push(match);
          return grouped;
        },
        {}
      );

      // Update grouped matches with filtered matches
      setMatches(filteredGroupedMatches);
    } else {
      // Group filtered matches by date
      const filteredGroupedMatches = data.results.reduce((grouped, match) => {
        const matchday = match.matchday;
        if (!grouped[matchday]) {
          grouped[matchday] = [];
        }
        grouped[matchday].push(match);
        return grouped;
      }, {});

      // Update grouped matches with filtered matches
      setMatches(filteredGroupedMatches);
    }
  }, [team, data.results]);

  // Click handler for matchday navigation buttons
  const handleMatchdayNavigation = (matchday) => {
    setCurrentMatchday(matchday);
  };

  return (
    <div className="container">
      {matches ? (
        <div className="team-pick">
          <img
            key="empty-team"
            id="empty-team"
            className={`team-crest-pick ${!team ? "selected" : ""}`}
            src={LaLigaIcon}
            alt="Empty Team"
            onClick={() => setTeam("")}
          />
          {Object.entries(data.teamCrests).map(([teamName, teamCrest]) => (
            <img
              key={teamName}
              id={teamName}
              className={`team-crest-pick ${
                team === teamName ? "selected" : ""
              }`}
              src={teamCrest}
              alt={teamName}
              onClick={() => setTeam(teamName === team ? "" : teamName)}
            />
          ))}
        </div>
      ) : (
        ""
      )}
      {matches ? (
        <div className="matchday-pick">
          {/* Back button */}
          {matchdays.indexOf(currentMatchday) > 0 && (
            <button
              className="button-17"
              onClick={() =>
                handleMatchdayNavigation(
                  matchdays[matchdays.indexOf(currentMatchday) - 1]
                )
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              Matchday &nbsp;
              {matchdays[matchdays.indexOf(currentMatchday) - 1]}
            </button>
          )}
          {/* Forward button */}
          {matchdays.indexOf(currentMatchday) < matchdays.length - 1 && (
            <button
              className="button-17"
              onClick={() =>
                handleMatchdayNavigation(
                  matchdays[matchdays.indexOf(currentMatchday) + 1]
                )
              }
            >
              Matchday &nbsp;
              {matchdays[matchdays.indexOf(currentMatchday) + 1]}
              <FontAwesomeIcon icon={faChevronRight} />{" "}
            </button>
          )}
        </div>
      ) : (
        ""
      )}

      {/* Display matches for current date */}
      {matches ? (
        <ul className="list-group list-group-sm">
          {matches[currentMatchday].map((match) => (
            <li key={match.matchId} className="list-group-item">
              <div className="row align-items-center">
                <div className="col-md-2 col-3">
                  <div className="d-flex flex-column align-items-center">
                    <img
                      className="team-crest mb-2"
                      src={match.homeTeamCrest}
                      alt={match.homeTeam}
                    />
                    <span className="text-white text-center">
                      {match.homeTeam}
                    </span>
                  </div>
                </div>
                <div className="col-md-2 col-3">
                  <p className="text-white text-center mb-0">{match.score}</p>
                </div>
                <div className="col-md-2 col-3">
                  <div className="d-flex flex-column align-items-center">
                    <img
                      className="team-crest mb-2"
                      src={match.awayTeamCrest}
                      alt={match.awayTeam}
                    />
                    <span className="text-white text-center">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
                <div className="col-md-2 col-3">
                  <div className="d-flex flex-column align-items-center">
                    <div>
                      <span className="text-white text-center">
                        Matchday {match.matchday}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-3">
                  <p className="text-white text-center mb-0">{match.date}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h2>There are no results yet!</h2>
      )}
    </div>
  );
};

export default Results;
