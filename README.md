#notes2toggl
Script to log time in Toggl by text file in given format.

Notes format
```
11.02.2018
8:00 - 9:00 I did something nice [Project Name] #tag #tag2
9:00 - 13:00 I did other thing [Other Project Name]

12.02.2018
8:00 - 9:00 I did something on the next day
```

##Usage
If installed globally:

from pipe
```
cat note.txt | notes2toggl
```

directly
```
notes2toggl note.txt
```