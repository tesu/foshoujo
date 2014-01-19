var scriptBuilder = require("../../includes/scriptbuilder.js");
s = new scriptBuilder()

s.music("sHk-VDpKWR4");
s.speaker("PLAYERNAME");
s.text("What the fuck is going on. Is this even a real VN?");
s.speaker("Joe");
s.text("Yes, this is a VN.");
s.text("Fuck you.");
s.speaker("");
s.text("Joe hits you in the face with a guitar.");
s.speaker("PLAYERNAME");
s.text("What the fuck was that for Joe?");
s.speaker("Joe");
s.text("kill urself");
s.text("I will count to 10 now...")
s.text("1")
s.text("2")
s.text("3")
s.text("4")
s.text("5")
s.text("6")
s.text("7")
s.text("8")
s.text("9")
s.text("10")
s.music("");
s.text("Ha, now the music's gone!")
s.function(function(io, socket, s){
s.speaker("")
s.text("THE END LMAO");
s.text("Just kidding...");
s.text("NOT");
});

for (p in s) exports[p] = s[p];
