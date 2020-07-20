var BugApp = {}

const field_data = {
    desc: {
        fn: "Short Description",
        ht: "Describe your bug in a single sentence",
        al: "t",
        fi: "#desc-field"
    },
    exp: {
        fn: "Expected Result",
        ht: "What *should* happen when following the steps? (i.e. if the bug didn't occur)",
        al: "e",
        fi: "#exp-field"
    },
    act: {
        fn: "Actual Result",
        ht: "What *actually* happens when following the steps?",
        al: "a",
        fi: "#act-field"
    },
    client: {
        fn: "Client Version",
        ht: "The version/build of Discord you're using, e.g. TestFlight 31.0",
        al: "c",
        fi: "#client-field"
    },
    sys: {
        fn: "System Settings",
        ht: "Your system settings including device model (if on mobile), OS, and version, e.g. iPhone 11, iOS 13.5.1",
        al: "s",
        fi: "#sys-field"
    }
};

const mm = {
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
    let bugtext = '';
    let report = [];
    const elements = ['desc', 'exp', 'act', 'client', 'sys'];
    elements.forEach(function (item, idx) {
        let fv = $(field_data[item]['fi']).val();
        if (fv) {
            let element = '-' + field_data[item]['al'] + ' ' + fv;
            report.push(element);
        }
    });
    let steps = [];
    for (let i = 1; i <= BugApp.sct; i++) {
        let step = $('#s' + i + '-field').val();
        if (step) {
            steps.push(step);
        }
    }
    if (steps.length) {
        report.splice(1, 0, '-r ' + steps.join(' ~ '));
    }
    if ((report.length - 1) == BugApp.fields) {
        bugtext = '!submit ' + report.join(' ');
    }
    $('#syntax').text(bugtext);
    $('#lrg-rep').toggleClass('hidden', bugtext.length < 1400);
}

function addStep() {
    BugApp.sct++;
    const stxt = '<div class="input-group" id="s' + BugApp.sct + '-grp"><span class="input-group-label">Step ' + BugApp.sct + '</span><input type="text" class="input-group-field" id="s' + BugApp.sct + '-field"></div>';
    $('#steps-fs').append(stxt);
}

function removeStep(event) {
    if (BugApp.sct > 1) {
        $('#s' + BugApp.sct + '-grp').remove();
        BugApp.sct--;
        if (typeof(event.data) !== 'undefined' && event.data.edit) {
            updateEditSyntax();
        } else {
            updateSyntax();
        }
    }
}

function updateEditSyntax() {
    const edit_id = $('#edit-id').val();
    const edit_type = $('#edit-section').val();
    let edit_val = '';
    let alias = '';
    if (edit_type == 'steps') {
        alias = 'r';
        let steps = [];
        for (let i = 1; i <= BugApp.sct; i++) {
            let step = $('#s' + i + '-field').val();
            if (step) {
                steps.push(step);
            }
        }
        if (steps.length) {
            edit_val = steps.join(' ~ ');
        }
    } else {
        edit_val = $('#' + edit_type + '-field').val();
        alias = field_data[edit_type].al;
    }
    let edit_txt = '';
    if (edit_id && edit_val) {
        edit_txt = '!edit ' + edit_id + ' -' + alias + ' ' + edit_val;
    }
    $('#edit-syntax').text(edit_txt);
}

function updateField(event) {
    $('#edit-syntax').text('');
    BugApp.sct = 1;
    $('#add-btn').off('click');
    $('#del-btn').off('click');
    switch(event.target.value) {
        case "steps":            
            const steps_html = '<label>Steps to Reproduce</label><p class="help-text" id="steps-help">Write each step others would have to follow to reproduce the bug. Note: Tildes will be added automatically for each step. To add/remove fields, you can use the buttons below</p><div class="callout mbox" id="steps-fs"><div class="button-group small"><button type="button" class="button" id="add-btn"><i class="fas fa-plus"></i> Add</button><button type="button" class="button" id="del-btn"><i class="fas fa-minus"></i> Remove</button></div><div class="input-group" id="s1-grp"><span class="input-group-label">Step 1</span><input type="text" class="input-group-field" id="s1-field" required></div></div>';
            $('#edit-field').html(steps_html);
            $('#add-btn').on('click', addStep);
            $('#del-btn').on('click', {edit: true}, removeStep);
            break;
        default:
            if (event.target.value in field_data) {
                const field_html = '<label for="' + event.target.value + '-field">' + field_data[event.target.value].fn + '</label><p class="help-text" id="' + event.target.value + '-help">' + field_data[event.target.value].ht + '</p><input type="text" id="' + event.target.value + '-field" aria-describedby="' + event.target.value + '-help" required>';
                $('#edit-field').html(field_html);
            }
    }
}

function loadTheme() {
    let light = false;
    if (typeof(Storage) !== 'undefined') {
        light = (localStorage.getItem('light') == 'true');
    }
    return light;
}

function setTheme() {
    if (typeof(Storage) !== 'undefined') {
        let light = false;
        if ($('body').attr('class') == 'light') {
            light = true;
        }
        localStorage.setItem('light', light.toString());
    }
}

function switchMode() {
    let bc = $('body').toggleClass('light')[0].className;
    if (bc == '') {
        bc = 'dark';
    }
    $('#switch-mobile').html('<i class="far fa-' + mm[bc].m + '"></i>');
    $('#switch-desktop').html('<i class="far fa-' + mm[bc].m + '"></i> ' + mm[bc].d);
    setTheme();
}

function pageLoad(page) {
    BugApp.fields = Object.keys(field_data).length
    BugApp.sct = 1;
    let cb_btn = '';
    let st = '';
    switch (page) {
        case "create":
            $('div#content').on('input', 'input[id*="-field"]', updateSyntax);
            $('#add-btn').on('click', addStep);
            $('#del-btn').on('click', removeStep);
            cb_btn = '#copy-btn';
            st = '#syntax';
            break;
        case "edit":
            $('#edit-section').on('change', updateField);
            $('#edit-id').on('input', updateEditSyntax);
            $('div#content').on('input', 'input[id*="-field"]', updateEditSyntax);
            $('#edit-section').change();
            cb_btn = '#edit-copy-btn';
            st = '#edit-syntax';
            break;
    }
    let cb = new ClipboardJS(cb_btn, {
        text: function(trigger) {
            return $(st).text();
        }
    });
    cb.on('success', function(e) {
        $(e.trigger).html('Copied');
        ga('send', 'event', 'syntax', 'copy');
        setTimeout(function() {
            $(e.trigger).html('Copy');
        }, 2000);
    });
    $('body').on('click', 'a[id*="switch-"]', switchMode);
    if (loadTheme()) {
        switchMode();
    }
}
