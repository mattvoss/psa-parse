Installation
============

After cloning the repo run

```
npm install -d
````

Usage
=====

```
node app.js -l {letter of authenticity number goes here E.g. U}
```

Options
=======
-l {A}, --letter {A} = letter of authenticity number

-s {0}, --start {0} = number to begin download of data from website

Output
======
It writes data to a csv file in the directory of the app using the naming format of {letter}00000.csv

The CSV has this format:

```
'Item: Program','Primary Subject: MICKEY MANTLE','O00000'
'Item: Magazine','Primary Subject: WILT CHAMBERLAIN','O00001'
'Item: Photograph','Primary Subject: WILT CHAMBERLAIN','O00002'
'Item: Contract','Primary Subject: WILT CHAMBERLAIN','O00003'
'Item: Photograph','Primary Subject: JIMMIE FOXX','O00004'
'Item: Photograph','Primary Subject: HONUS WAGNER','O00005'
'Item: Litho','Primary Subject: MICHAEL JORDAN','O00006'
'Item: Photograph','Primary Subject: TY COBB','O00007'
'Item: Magazine','Primary Subject: MUHAMMAD ALI','O00009'
'Item: AUTOGRAPH ITEM','Primary Subject: MUHAMMAD ALI','O00012'
```
