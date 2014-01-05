var s = require("../../includes/scriptbuilder.js");

s.music("sHk-VDpKWR4");
s.speaker("bob");
s.text("hello i am bob");
s.text("do u even lift");
s.text("ok");
s.speaker("not bob");
s.text("im not bob");
s.text("ok");
s.text("?????????????????");
s.speaker("");
s.text("now nobody is talking");
s.text("yay");
s.text("???");
s.speaker("fred");
s.text("hello");
s.text("ok");
s.music("");
s.text("the music just stopped?");
s.text("ok");
s.speaker("bob");
s.text("im back");
s.text("THE END");

for (prop in s.output) {
	exports[prop] = s.output[prop];
}