
import { datesDiffInDays } from './NASANeoSupportFunctions.js'

import sort_down_arrow from '../images/Down_Red_Arrow.jpg'

export function flattenNASANeoData(dataNEOsFromNASA, neoInputState) {

    const allNearEarthObjectsToFlatten_0 = dataNEOsFromNASA.near_earth_objects

    const numberOfDays = datesDiffInDays(neoInputState.dateNeoSearchStart, neoInputState.dateNeoSearchEnd)

    let flatAllNEOsArray = []

    let loopDate = ""
    let flatDateForLoopNEOs = []

    for (let loopDaysToAdd = 0; loopDaysToAdd <= numberOfDays; loopDaysToAdd++) {

        /* 
            new Date() is returning GMT time if I pass in "YYYY-MM-DD"  which ends up being -7 hrs for current Pacific Time Zone
            and ends up being the day before.  If I pass in Date("2022-03-29")
                    Date() returns "Mon Mar 28 2022 17:00:00 GMT-0700 (Pacific Daylight Time)"
            If I pass in Date("YYYY-MM-DD 0:00") then 
                    Date() returns "Tue Mar 29 2022 00:00:00 GMT-0700 (Pacific Daylight Time)"
        */
        loopDate = new Date(neoInputState.dateNeoSearchStart + " 0:00")

        loopDate.setDate(loopDate.getDate() + loopDaysToAdd)

        let loopDateMonthString = ((loopDate.getMonth() + 1 < 10) ? "0" : "") + (loopDate.getMonth() + 1).toString()
        let loopDayOfMonthString = ((loopDate.getDate() < 10) ? "0" : "") + (loopDate.getDate()).toString()

        // 2022-01-03 === YYYY-MM-DD
        const NEODateFormat = loopDate.getFullYear().toString() + '-' +
            loopDateMonthString + '-' +
            loopDayOfMonthString

        /*
            Array from allNEOsArray.[0].near_earth_objects["2022-03-01"][]
                from allNEOsArray.[0].near_earth_objects["2022-03-02"][]
                from allNEOsArray.[0].near_earth_objects["2022-03-03"][]
        */
        let flatNEOsArrayForDate = allNearEarthObjectsToFlatten_0[NEODateFormat].map((neoForDate) => {
            return (
                {
                    id:                         neoForDate.id,
                    name:                       neoForDate.name,
                    links_self:                 neoForDate.links.self,
                    is_potentially_hazardous_asteroid:      neoForDate.is_potentially_hazardous_asteroid,
                    est_diameter_feet_est_diameter_max:     neoForDate.estimated_diameter.feet.estimated_diameter_max,
                    closest_approach_date:                  neoForDate.close_approach_data[0].close_approach_date,
                    closest_approach_date_full:             neoForDate.close_approach_data[0].close_approach_date_full,
                    cad_relative_velocity_miles_per_hour:   neoForDate.close_approach_data[0].relative_velocity.miles_per_hour,
                    cad_orbiting_body:                      neoForDate.close_approach_data[0].orbiting_body,
                    cad_miss_distance_astronomical:         neoForDate.close_approach_data[0].miss_distance.astronomical,
                    cad_miss_distance_kilometers:           neoForDate.close_approach_data[0].miss_distance.kilometers,
                    cad_miss_distance_lunar:                neoForDate.close_approach_data[0].miss_distance.lunar,
                    cad_miss_distance_miles:                neoForDate.close_approach_data[0].miss_distance.miles
                }
            )

        })  // .map

        flatAllNEOsArray = flatDateForLoopNEOs.concat(flatNEOsArrayForDate)

        flatDateForLoopNEOs = flatAllNEOsArray

    } // for
    
    return flatAllNEOsArray

}  // function flattenNASANeoData


export async function getNASANeoDataViaAPI(neoInputState, setAllNEOsArray, setNeoAppStatus, setTableState) {

    let response = { status: 123, type: "Starting Function call getNASANeoDataViaAPI", statusText: "Just beginning"}

    const numberOfDays = datesDiffInDays(neoInputState.dateNeoSearchStart, neoInputState.dateNeoSearchEnd)

    if (numberOfDays < 0) {

        response.status = 123
        response.type = "function getNASANeoDataViaAPI() hasn't called fetech(api.nasa.gov) yet"
        response.statusText = `Start Date ${neoInputState.dateNeoSearchStart} is after End Date ${neoInputState.dateNeoSearchEnd}`
    }

    else {

        response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoInputState.dateNeoSearchStart}&end_date=${neoInputState.dateNeoSearchEnd}&api_key=hk9dlTx899cmJzkwCDyLjxLbI1Apz2qh5IjGT3Ja`);

        if (response.status === 200) {

            const dataNEOsFromNASA = await response.json();

            // Now it is array of all the dataNEOsFromNASA[0].near_earth_objects
            const flattenedNEOData = flattenNASANeoData(dataNEOsFromNASA, neoInputState)

            setAllNEOsArray(prevAllNEOsArray => {
                return { 
                    links               : dataNEOsFromNASA.links,
                    element_count       : dataNEOsFromNASA.element_count,
                    near_earth_objects  : flattenedNEOData
                }
            })
        
            setTableState(prevSetTableState => {
                return {
                    currentFirstRowShowing: "0", 
                    sortColumn      : "closest_approach_date_full",
                    isSortAscending : true,
                    sortColumnImage : sort_down_arrow
                }
            })
    
        }
        else {
            console.warn(`NASA NEO HTTP request attempted failed Status Code (${response.status}), here is response.type and .statusText`);
            console.warn(`(${response.type})`)
            console.warn(`(${response.statusText})`)

        }
    }


    setNeoAppStatus(prevNeoAppStatus => {
        return { 
            responseStatus:     response.status,
            responseType:       response.type,
            responseStatusText: response.statusText
        }
    })

}