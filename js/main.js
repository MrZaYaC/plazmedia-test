var peoples = new Array();

$(function(){
    getXml();
    $('.search').find('input').keyup(function(){
        var request = $(this).val();
        if(request.length != 0){
            search(request);
        } else {
            render(peoples);
        }
    })
    $('#add').on('click', function(){
        $('#name').val('');
        $('#description').val('');
        $('#photo').val('');
        $('#modal').modal();
    })

    $('#create').on('click', function(){
        $('#form').submit();
        $('#modal').modal('hide');
    })
})

function search(request){
    var result = new Array();
    peoples.forEach(function(people){
        if((people.name.toLowerCase().search(request.toLowerCase()) != -1)
            || (people.description.toLowerCase().search(request.toLowerCase()) != -1)){
            result.push(people)
        }
    })
    if(result.length == 0){
        $('.data').html('<div class="search-error">Ничего не найдено</div>');
    } else {
        render(result)
    }
}

function getXml(){
    $.ajax({
        type: "GET",
        url: "xml/people.xml",
        dataType: "xml",
        success: xmlParser
    });
}

function xmlParser(xml){
    peoples = new Array();
    $(xml).find('item').each(function(){
        peoples.push(
            {
                photo: $(this).find('photo').text(),
                name: $(this).find('name').text(),
                description: $(this).find('description').text(),
                escapes: $(this).find('escapes').text()
            }
        )
    })
    render(peoples)
}

function render(peoples){
    var el = $('.data');
    var letter;
    function SortByName(a, b){
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    function renderItem(el, item){
        el.append('<div class="item"><div class="item-photo"><img src="'
            + item.photo + '"></div><div class="item-info"><div class="item-name">'
            + item.name +'</div><div class="item-description">'
            + item.description + '</div></div><div class="item-escapes">'
            + item.escapes + ' escapes</div></div>')
    }
    el.html('');
    peoples.sort(SortByName);
    peoples.forEach(function(people){
        if(people.name.substr(0,1).toUpperCase() == letter){
            renderItem(el, people);
        } else {
            letter = people.name.substr(0,1).toUpperCase();
            el.append('<div class="letter">' + letter +'</div>')
            renderItem(el, people);
        }
    })
}