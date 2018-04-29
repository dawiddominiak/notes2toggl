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

Date is not required. `Today` is the default date.

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

export API_TOKEN and WORKSPACE_ID:
```
export API_TOKEN=***
export WORKSPACE_ID=***
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

## Connected apps
`notes2toggl` is even more powerful together. Check other applications using `notes2toggl`:

1. [cal2notes2toggl](https://github.com/kulak-at/cal2notes2toggl) -
app is converting Google calendar entries to notes format that can be uploaded directly to Toggl. If you will create a proper entry (with a proper project name) you can pipe your calendar entries directly to Toggl with bash pipe: `$ cal2notes2toggl https://calendar.google.com/calendar/ical/..... | notes2toggl`

## Thanks
Special thanks for [Swing Development](https://www.swingdev.io) - company I am working for, for give me time for needed upgrades during working hours.
