var $input = $('#query-input');
var $results = $('#results');

function searchWikipedia (term) {
    return $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: term
        }
    }).promise();
}

/* Only get the value from each key up */
var keyups = Rx.Observable.fromEvent($input, 'keyup')
    .pluck('target', 'value')
    .filter(text => text.length > 2 );

/* Now debounce the input for 500ms */
var debounced = keyups
    .debounce(500 /* ms */);

/* Now get only distinct values, so we eliminate the arrows and other control characters */
var distinct = debounced
    .distinctUntilChanged();

var suggestions = distinct
    .flatMapLatest(searchWikipedia);

suggestions.subscribe(
    data => {
        $results
            .empty()
            .append($.map(data[1], value =>  $('<li>').text(value)))
    },
    error=> {
        $results
            .empty()
            .append($('<li>'))
            .text('Error:' + error);
    });