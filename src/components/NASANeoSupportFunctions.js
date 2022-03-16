

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
     const firstDate = new Date(firstDateString);
     const secondDate = new Date(secondDateString);
         
     const millisecondsDiff = secondDate.getTime() - firstDate.getTime();
         
     return ( millisecondsDiff / (1000 * 60 * 60 * 24) )
 }
