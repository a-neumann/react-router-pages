const Enyzme = require("enzyme");
const ReactAdapter = require("enzyme-adapter-react-16");

Enyzme.configure({ adapter: new ReactAdapter() });