'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LevelBlocks = function () {
  function LevelBlocks() {
    _classCallCheck(this, LevelBlocks);
  }

  _createClass(LevelBlocks, null, [{
    key: 'block123x1234',
    value: function block123x1234() {
      return ['o-o\n\
  |\n\
o-o\n\
|  \n\
o-o\n\
  |\n\
  o', 'o-o\n\
  |\n\
o-o\n\
| |\n\
o-o\n\
  |\n\
  o', 'o-o\n\
| |\n\
o-o\n\
|  \n\
o-o\n\
  |\n\
  o', 'o o\n\
| |\n\
o-o\n\
|  \n\
o-o\n\
  |\n\
  o'];
    }
  }, {
    key: 'block1234x1234',
    value: function block1234x1234() {
      return ['o-o\n\
| |\n\
o-o\n\
| |\n\
o-o\n\
| |\n\
o-o', 'o-o\n\
  |\n\
o-o\n\
|  \n\
o-o\n\
  |\n\
o-o', 'o-o\n\
|  \n\
o-o\n\
  |\n\
o-o\n\
|  \n\
o-o'];
    }
  }, {
    key: 'block1x12',
    value: function block1x12() {
      return ['o-o\n\
  |\n\
  o\n\
   \n\
   \n\
   \n\
   '];
    }
  }, {
    key: 'block2x23',
    value: function block2x23() {
      return ['   \n\
   \n\
o-o\n\
  |\n\
  o\n\
   \n\
   '];
    }
  }, {
    key: 'block3x34',
    value: function block3x34() {
      return ['   \n\
   \n\
   \n\
   \n\
o-o\n\
  |\n\
  o'];
    }
  }]);

  return LevelBlocks;
}();