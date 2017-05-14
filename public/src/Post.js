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
        $('#wantGiveFeedback').click(function(){
            if (this.checked) {
                $('#freeCommentTextArea').show()
            } else {
                $('#freeCommentTextArea').hide()
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
        } else {
            $('#emailAddress').hide()
        }
    }
}

Prato.Post = new Post()