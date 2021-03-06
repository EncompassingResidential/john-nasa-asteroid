

export function formatFloatToString(floatNumber) {

    if (Number.isFinite(floatNumber) === true) {
         const fixedDecimals = floatNumber.toFixed(2)
         const formatedNumber = new Intl.NumberFormat("en-US", {
             style: "decimal",
             currency: "USD"
         }).format(fixedDecimals)

         return(formatedNumber)
     } else {

         return(`Error - $ floatNumber (${floatNumber}) is not number`)
     }
 }

 export function datesDiffInDays(firstDateString, secondDateString) {

    let millisecondsDiff = -12345679
    
    if (firstDateString !== undefined && secondDateString !== undefined &&
        firstDateString !== NaN && secondDateString !== NaN) {
        if (firstDateString !== "" && secondDateString !== "") {
            const firstDate = new Date(firstDateString);
            const secondDate = new Date(secondDateString);
                
            millisecondsDiff = secondDate.getTime() - firstDate.getTime();
        }
    }
         
    return ( millisecondsDiff / (1000 * 60 * 60 * 24) )
 }

 export function sortNEOArray(dateNEOsArray, tableState) {

    switch (tableState.sortColumn) {
        case "closest_approach_date_full":
            dateNEOsArray.sort((a, b) => {
                const a_closest_approach_date_full = new Date(a.closest_approach_date_full)
                const b_closest_approach_date_full = new Date(b.closest_approach_date_full)

                // Sort by Closest Approach Date Full (Full has military time of day)

                return (tableState.isSortAscending) 
                    ? a_closest_approach_date_full.getTime() - b_closest_approach_date_full.getTime()
                    : b_closest_approach_date_full.getTime() - a_closest_approach_date_full.getTime()

                // Sort by Miss Distance in Miles
                // return a.cad_miss_distance_miles - b.cad_miss_distance_miles


                })
            break;

            // 3/19/22 this didn't work exactly correct
        case "name":
            dateNEOsArray.sort((a, b) => {
                // Sort by Diameter Max in Feet
                return (tableState.isSortAscending) 
                    ? a.name - b.name
                    : b.name - a.name
            })
            break;

        case "est_diameter_feet_est_diameter_max":
            dateNEOsArray.sort((a, b) => {
                // Sort by Diameter Max in Feet
                return (tableState.isSortAscending) 
                    ? a.est_diameter_feet_est_diameter_max - b.est_diameter_feet_est_diameter_max
                    : b.est_diameter_feet_est_diameter_max - a.est_diameter_feet_est_diameter_max
            })
            break;
            
        case "cad_relative_velocity_miles_per_hour":
            dateNEOsArray.sort((a, b) => {
                // Sort by Relative Velocity in Miles per hour
                return (tableState.isSortAscending) 
                    ? a.cad_relative_velocity_miles_per_hour - b.cad_relative_velocity_miles_per_hour
                    : b.cad_relative_velocity_miles_per_hour - a.cad_relative_velocity_miles_per_hour
            })
            break;


        case "cad_miss_distance_miles":
            dateNEOsArray.sort((a, b) => {
                // Sort by Relative Velocity in Miles per hour
                return (tableState.isSortAscending) 
                    ? a.cad_miss_distance_miles - b.cad_miss_distance_miles
                    : b.cad_miss_distance_miles - a.cad_miss_distance_miles
            })
            break;
    
        default:
            
    }

 }