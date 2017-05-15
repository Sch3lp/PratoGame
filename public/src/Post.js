class Post {
    create() {
        $("#postForm").submit((e) => {
            $.post(window.location.href + 'playerinfo', $('#postForm').serialize())
            document.getElementById('postFormDiv').style.display = 'none'
            this.state.start('Game', true, false, true)
            e.preventDefault()
        })

        $('#infoAboutPrato').click(this.showForCheckboxes)
        $('#infoAboutDevStuff').click(this.showForCheckboxes)
        $('#infoAboutVacancies').click(this.showForCheckboxes)
        $('#wantGiveFeedback').click(function () {
            if (this.checked) {
                $('#freeCommentTextArea').show()
                $('#freeCommentTextArea').prop('required', true);
            } else {
                $('#freeCommentTextArea').hide()
                $('#freeCommentTextArea').prop('required', false);
            }
        })

        document.getElementById('postFormDiv').style.display = 'block'

        this.input.keyboard.removeKey(Phaser.Keyboard.DOWN)
        this.input.keyboard.removeKey(Phaser.Keyboard.UP)
    }

    showForCheckboxes() {
        if ($('#infoAboutPrato')[0].checked
            || $('#infoAboutDevStuff')[0].checked
            || $('#infoAboutVacancies')[0].checked) {
            $('#emailAddress').show()
            $('#emailAddressInput').prop('required', true);
        } else {
            $('#emailAddress').hide()
            $('#emailAddressInput').prop('required', false);
        }
    }
}

Prato.Post = new Post()