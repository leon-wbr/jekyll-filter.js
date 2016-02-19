Array.prototype.byCount= function(){
    var itm, a= [], L= this.length, o= {};
    for(var i= 0; i<L; i++){
        itm= this[i];
        if(!itm) continue;
        if(o[itm]== undefined) o[itm]= 1;
        else ++o[itm];
    }
    for(var p in o) a[a.length]= p;
    return a.sort(function(a, b){
        return o[b]-o[a];
    });
}

var filter = {
  data: null,
  template: null,
  entries: null,
  results: null,
  selectors: {},

  /**
   * Initiates the filters and data
   */
  init: function(dataUrl){
    var self = this;

    $.getJSON(dataUrl).done(function(resultData){
      self.data = resultData;
      self.entries = self.data.entries;
      self.selectors = self.setupSelectors();

      $.get(self.data.template).done(function(resultTemplate){
        self.template = Liquid.parse(resultTemplate);
      }).done(function(){
        self.showFilters();
      });
    });
  },

  /**
   * Automatically sets values for each select input if none provided
   */
  setValues: function(){
    var self = this,
        values = {},
        cleanValues = {},
        attr = null;

    $('.filters select').each(function(){
      attr = $(this).attr('id');
      values[attr] = [];

      if($(this).children().length > 0) return true;

      $.each(self.entries, function(index, value){
        if(this[attr] != null) values[attr].push(this[attr]);
      });
    });

    $.each(values, function(index, value){
      attr = index;

      switch($('.filters select#' + attr).attr('data-type')){
        case 'country':
          cleanValues[index] = self.sortCountry(value);
          break;
        default:
          cleanValues[index] = $.unique(value);
          break;
      }
    });

    $.each(cleanValues, function(index, value){
      attr = index;

      if($('.filters select#' + attr).children().length > 0) return true;

      $('.filters select#' + attr).append("<option>All</option>");

      $.each(value, function(index, value){
        $('.filters select#' + attr).append("<option>" + value + "</option>");
      });
    });
  },

  /**
   * Checks the values and returns them
   */
  getValues: function(){
    var selectors = {};

    $('.filters select').each(function(){
      selectors[$(this).attr('id')] = $(this).val();
    });

    return selectors;
  },

  /**
   * Sets up the filter options
   */
  setupSelectors: function(){
    var self = this;
    var selectors = {};

    this.setValues();
    selectors = this.getValues();

    return selectors;
  },

  /**
   * Filters through the results and appends a rendered template to .filters-content
   */
  filter: function(){
    var self = this;

    $('.filters-content').empty();
    this.selectors = this.getValues();

    $.each(this.selectors, function(i, item){
      self.results = $.grep(self.entries, function(element, index){

        if(item != null && item != "All"){
          return element[i] == item;
        }

        return true;
      });
    });

    $.each(this.results, function(i, item){
      $('.filters-content').append(self.template.render(item));
    })
  },

  /**
   * Shows the filters and adds event handlers
   */
  showFilters: function(){
    var self = this;

    // Add code to determine whether all data has laoded correctly

    $('.filters select').each(function(){
      $(this).change(function(){
        self.filter();
      });
    });

    $('.filters').show();
  },

  /**
   * Sorts countries
   */
  sortCountry: function(array){
    // Add some code to put English-speaking countries at top?

    return array.byCount();
  }
}
