const moment = require('moment');

module.exports = {
    truncate: (str, len) => {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: (date, format) => {
        return moment(date).format(format);
    },
    select: (selected, options) => {
        return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), 'selected="selected"$&')
    },
    editIcon: (activityUser, loggedUser, activityId, floating = true) => {
        if(activityUser == loggedUser){
            if(floating){
                return `<a href="/activities/edit/${activityId}" class="btn-floating halfway-fab teal lighten-1"><i class="fa fa-pencil"></i></a>`;
            } else {
                return `<a href="/activities/edit/${activityId}" class="teal-text text-lighten-1"><i class="fa fa-pencil"></i></a>`;
            }
        } else {
            return '';
        }
    }
}