'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Post = function () {
    function Post() {
        _classCallCheck(this, Post);
    }

    _createClass(Post, [{
        key: 'create',
        value: function create() {
            var _this = this;

            $("#postForm").submit(function (e) {
                $.post(window.location.origin + '/playerinfo', $('#postForm').serialize());
                document.getElementById('postFormDiv').style.display = 'none';
                _this.state.start('Game', true, false, true);
                e.preventDefault();
            });

            $('#infoAboutPrato').click(this.showForCheckboxes);
            $('#infoAboutVacancies').click(this.showForCheckboxes);
            $('#wantGiveFeedback').click(function () {
                if (this.checked) {
                    $('#freeCommentTextArea').show();
                    $('#freeCommentTextArea').prop('required', true);
                } else {
                    $('#freeCommentTextArea').hide();
                    $('#freeCommentTextArea').prop('required', false);
                }
            });

            document.getElementById('postFormDiv').style.display = 'block';

            this.input.keyboard.removeKey(Phaser.Keyboard.DOWN);
            this.input.keyboard.removeKey(Phaser.Keyboard.UP);
        }
    }, {
        key: 'showForCheckboxes',
        value: function showForCheckboxes() {
            if ($('#infoAboutPrato')[0].checked || $('#infoAboutVacancies')[0].checked) {
                $('#emailAddress').show();
                $('#emailAddressInput').prop('required', true);
            } else {
                $('#emailAddress').hide();
                $('#emailAddressInput').prop('required', false);
            }
        }
    }]);

    return Post;
}();

Prato.Post = new Post();