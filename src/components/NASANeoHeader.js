
import NASA_NEO_image from "../images/NASA and NASA Earth Observations NEO.jpg";

export default function ExpensesHeader() {
    return (
    <div className="expense--header">
            <img className="header--image" src={NASA_NEO_image} alt="" />
            <h2 className="header--title">NASA Earth Observations NEO - Asteroid Search App</h2>
            <h4 className="header--project">SDMM Project 5 Version 3/09/22</h4>
    </div>
    )
  }
