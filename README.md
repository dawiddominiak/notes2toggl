# notes2toggl
Script to log time in Toggl by text file in given format.

Notes format
```
11.02.2018
8:00 - 9:00 I did something nice [Project ID or Name] #tag #tag2
9:00 - 13:00 I did other thing [Other Project ID or Name] #tag

12.02.2018
8:00 - 9:00 I did something on the next day [Project ID or Name]
```

## Requirements
```
node >= 9.0.0
```

## Installation
```
npm i -g notes2toggl
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

## Thanks
Special thanks for [Swing Development](https://www.swingdev.io) - company I am working for, for give me time for needed upgrades during working hours.
