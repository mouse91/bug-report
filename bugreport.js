var field_data = {
    desc: {
        fn: "Short Description",
        ht: "Describe your bug in a single sentence",
        al: "title"
    },
    exp: {
        fn: "Expected Result",
        ht: "What *should* happen when following the steps? (i.e. if the bug didn't occur)",
        al: "expected"
    },
    act: {
        fn: "Actual Result",
        ht: "What *actually* happens when following the steps?",
        al: "actual"
    },
    client: {
        fn: "Client Version",
        ht: "The version/build of Discord you're using, e.g. TestFlight 1.9.2",
        al: "cs"
    },
    sys: {
        fn: "System Settings",
        ht: "Your system settings including device model (if on mobile), OS, and version, e.g. iPhone 8, iOS 11.0.3",
        al: "ss"
    }
};

var mm = {
    dark: {
        d: "Light Mode",
        m: "sun"
    },
    light: {
        d: "Dark Mode",
        m: "moon"
    }
};

function updateSyntax() {
    var desc = $('#desc-field').val();
    var expected = $('#exp-field').val();
    var actual = $('#act-field').val();
    var client = $('#client-field').val();
    var system = $('#sys-field').val();
    var steps = '';
    var bugtext = '';
    for (var i = 1; i <= window.sct; i++) {
        var step = $('#s' + i + '-field').val();
        if (step) {
            steps = steps + ' - ' + step;
        }
    }
    if (desc && expected && actual && client && system && steps) {
        bugtext = '!submit ' + desc + ' | Steps to Reproduce:' + steps + ' Expected Result: ' + expected + ' Actual Result: ' + actual + ' Client Settings: ' + client + ' System Settings: ' + system;
    }
    $('#syntax').text(bugtext);
}

function addStep() {
    window.sct++;
    var stxt = '<div class="input-group" id="s' + window.sct + '-grp"><span class="input-group-label"><small>Step ' + window.sct + '</small></span><input type="text" class="input-group-field" id="s' + window.sct + '-field"></div>';
    $('#steps-fs').append(stxt);
}

function removeStep() {
    if (window.sct > 1) {
        $('#s' + window.sct + '-grp').remove();
        window.sct--;
        updateSyntax();
    }
}

function updateEditSyntax() {
    var edit_id = $('#edit-id').val();
    var edit_type = $('#edit-section').val();
    var edit_val = '';
    var alias = '';
    if (edit_type == 'steps') {
        alias = 'str';
        for (var i = 1; i <= window.sct; i++) {
            var step = $('#s' + i + '-field').val();
            if (step) {
                edit_val = edit_val + ' - ' + step;
            }
        }
        if (edit_val) {
            edit_val = edit_val.substr(1);
        }
    } else {
        edit_val = $('#' + edit_type + '-field').val();
        alias = field_data[edit_type].al;
    }
    var edit_txt = '';
    if (edit_id && edit_val) {
        edit_txt = '!edit ' + edit_id + ' | ' + alias + ' | ' + edit_val;
    }
    $('#edit-syntax').text(edit_txt);
}

function updateField(event) {
    $('#edit-syntax').text('');
    window.sct = 1;
    $('#add-btn').off('click');
    $('#del-btn').off('click');
    switch(event.target.value) {
        case "steps":
            var steps_html = '<fieldset class="fieldset" id="steps-fs"><legend><label>Steps to Reproduce</label></legend><p class="help-text db-help" id="steps-help">Write each step others would have to follow to reproduce the bug. Note: Dashes will be added automatically for each step. To add/remove fields, you can use the buttons below. Also note that the steps entered below will replace your current steps</p><div class="button-group small"><button type="button" class="button blurple" id="add-btn"><i class="fi-plus"></i> Add</button><button type="button" class="button blurple" id="del-btn"><i class="fi-minus"></i> Remove</button></div><div class="input-group" id="s1-grp"><span class="input-group-label"><small>Step 1</small></span><input type="text" class="input-group-field" id="s1-field" required></div></fieldset>';
            $('#edit-field').html(steps_html);
            $('#add-btn').on('click', addStep);
            $('#del-btn').on('click', removeStep);
            break;
        default:
            if (event.target.value in field_data) {
                var field_html = '<label for="' + event.target.value + '-field">' + field_data[event.target.value].fn + '</label><p class="help-text db-help" id="' + event.target.value + '-help">' + field_data[event.target.value].ht + '</p><input type="text" id="' + event.target.value + '-field" aria-describedby="' + event.target.value + '-help" required>';
                $('#edit-field').html(field_html);
            }
    }
}

function loadTheme() {
    var dark = false;
    if (typeof(Storage) !== 'undefined') {
        dark = (localStorage.getItem('dark') == 'true');
    }
    return dark;
}

function setTheme() {
    if (typeof(Storage) !== 'undefined') {
        var dark = false;
        if ($('body').attr('class') == 'dark') {
            dark = true;
        }
        localStorage.setItem('dark', dark.toString());
    }
}

function switchMode() {
    var bc = $('body').toggleClass('dark')[0].className;
    if (bc == '') {
        bc = 'light';
    }
    $('#switch-mobile').html('<i class="fa fa-' + mm[bc].m + '-o"></i>');
    $('#switch-desktop').html('<i class="fa fa-' + mm[bc].m + '-o"></i> ' + mm[bc].d);
    setTheme();
}

function pageLoad(page) {
    window.sct = 1;
    var cb_btn = '';
    var st = '';
    switch (page) {
        case "create":
            $(document).on('input', 'input[id*="-field"]', updateSyntax);
            $('#add-btn').on('click', addStep);
            $('#del-btn').on('click', removeStep);
            cb_btn = '#copy-btn';
            st = '#syntax';
            break;
        case "edit":
            $('#edit-section').on('change', updateField);
            $('#edit-id').on('input', updateEditSyntax);
            $(document).on('input', 'input[id*="-field"]', updateEditSyntax);    
            $('#edit-section').change();
            cb_btn = '#edit-copy-btn';
            st = '#edit-syntax';
            break;
    }
    var cb = new Clipboard(cb_btn, {
        text: function(trigger) {
            return $(st).text();
        }
    });
    cb.on('success', function(e) {
        $(e.trigger).html('Copied');
        setTimeout(function() {
            $(e.trigger).html('Copy');
        }, 2000);
    });
    $(document).on('click', 'a[id*="switch-"]', switchMode);
    if (loadTheme()) {
        switchMode();
    }
}