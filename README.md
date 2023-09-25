# John's NASA NEO Asteroid Search (JNNAS)

This App gets data from NASA's  “near earth objects” (NEO’s) JPL sever to search via the NASA API.

[The online version of this app is at Heroku website:](https://john-nasa-asteroid.herokuapp.com/)


[You can find John Ritz's CV Resume here at Linked In www](https://www.linkedin.com/in/johntritz/)

[Click here for my personal Life Coach website, specialty is Addiction after 5 years of addiction counseling in Oregon from 2016 to 2021](https://www.soberjourneycopilot.com/)

# When the App comes up

At 1st there will be no data unless you ran this app in the same browser before, then the previous data's session will be showing.

The data is from NASA's NEO data server.

## Where to run this App

[The online version of this app is at Heroku website:](https://john-nasa-asteroid.herokuapp.com/)

The first time you bring this website up, it might take 60 seconds to appear because Heroku spins up the server from scratch, rebuilding if necessary.  So, go to this Heroku web site then go get a drink and then come back.

## Picture of example App screen (The ubiquitous Screen Shot)
[John's NASA NEO App example Screen Shot]![John-NASA-NEO App Screen Shot](https://user-images.githubusercontent.com/94155021/159761018-7ec53072-3f26-4507-a983-481fc93e6a2a.jpg)

Here is what an example Screen Shot of the App looks like with data from 3/07/2016.  I've noticed that the number of rows per day (date) can change, so I think the NASA NEO server is dynamically calculating or updating the NEOs periodically.

## How to run the App and see a list of 
1 Choose a start date
2 Choose an end date
3 Type in the number of rows you want to see at a time.  (The "Go Back" and "Go Forward" buttons will automatically update to the number of rows you type in.)
4 Press the "Search for NEOs" button
5 The Search button will change to "Waiting on NASA" and show a pulsating circle.
6 When the data is returned or an error occurs with retrieving the data the Search button will revert to "Search for NEOs"

If there is a known error, there will be a message shown to the right of the "Search for NEOs" button.  See below section for known issues...

## Example of using Page buttons, Moving through the data

e.g. If NASA sends you 50 NEOs (50 rows), and you type in 4 Rows of Data to Show, then when the NEO data is initially displayed: You will only see the first 4 rows of the data.  Then when you press the "Go Forward # Rows" button, it will go to the next set of 4 rows, in this case, rows 5 through 8.

## Known issues / results that might be unexpected

~~~
1. - Start date and End Date are reversed.  
     Message will be displayed asking you to change your Start and End date.
2. - I've noticed that this NASA server doesn't like Start and End dates that are too far apart.
     I've noticed that this is almost any date difference of 8 days or more.
      e.g. 3/23/2022 and 3/31/2022 will most likely return an error from the NASA data server.
Error message example: from NASA "400 cors"   I've filled this out and show:
API Error Number (400) - - - Type (cors)
Error Message (This "400 cors" usually means that there are too many days
 between the Start 2021-04-29 & End Date 2021-05-08)

3. - If you find yourself waiting longer than 1 or 2 minutes then the data server never 
     talked back to us or the connection was lost and no error was returned so there is nothing to show.
       Please try to get the data again and press the "Search for NEOs" button.

4. - If you try to type in 0 rows to Show or try to delete a single digit of Rows
     to Show the app will automatically change the Rows of Data to Show to be 10.

5. - The columns sort in one direction.  Next release will sort in both directions.
    Work around, if you go to the bottom of the data then sort you will see each's column's maximum data.
~~~

## Updates / Next Revisions
~~~
- [ ] Change sort buttons to go up and Down
         (maybe change only sorting column to have arrow and other columns have different pic)
- [ ] Add “How many Moon Distances as Tooltip hover above Miss Distance table column”
- [ ] Have Extra information shown when click on row’s button “NEO Details”
- [ ] Add export CSV file.
~~~


### manual acquistion of data

https://api.nasa.gov/

Here is getting NEOs objects via date range:
https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-03-10&end_date=2022-03-10&api_key={API_KEY}

The date range data has asteroid ID which can be used to get more data about that NEO.  Here is API call for Asteroid ID:
https://api.nasa.gov/neo/rest/v1/neo/3313974?api_key={API_KEY}


### Resources for the code

helped with Javascript FETCH commands
Using www https://www.javascripttutorial.net/javascript-fetch-api/

This project uses Bootstrap CSS with [Create React App](https://github.com/facebook/create-react-app).
and Bootstrap styling library / framework.

