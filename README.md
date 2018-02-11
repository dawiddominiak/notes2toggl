# notes2toggl
Script to log time in Toggl by text file in given format.

Notes format
```
11.02.2018
8:00 - 9:00 I did something nice [Project ID] #tag #tag2
9:00 - 13:00 I did other thing [Other Project ID] #tag

12.02.2018
8:00 - 9:00 I did something on the next day [Project ID]
```

## Usage
If installed globally:

export API_TOKEN:
```
API_TOKEN=***
```
and use it:

from pipe
```
cat note.txt | notes2toggl
```

directly
```
notes2toggl note.txt
```