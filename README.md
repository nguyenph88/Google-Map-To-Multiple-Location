Google-Map-To-Multiple-Location
===============================

Google Map to Multiple Location, Intern challenge from Clicktime Summer 2014

The challenge is to use Google Map API to find a direction from current location to Clicktime Office in San Francisco. However, during the trip I must stop to get some coffee and donut. Since i'm in SF so it's impossible to drive, the website should return the direction by Walk/Bicycle/Public Transit.

My Approach: this challenge is very basic and simple, it requires to use google map api just to direct. The problem is google map API will NOT return partial directions for PUBLIC TRANSIT. Meant that if I had some way points between the starting and ending point, there is no way for me to get the direction for PUBLIC TRANSIT. The challenge doesn't require me to actually draw the direction on map but since I want to impress them I did it and it took me a lot of time. As a result, I couldn't finish it on time :( and yes, I couldn't finish the challenge either. This is a sample code from what I have done so far ( pretty much work for direction with waypoints in between, and for Walking only)
