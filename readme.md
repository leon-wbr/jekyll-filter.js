# jekyll-filter.js

This script provides a simple way to add filters to a page within Jekyll. It's intended to be used with data files or collections, as well as custom JSON. Currently not tested very thoroughly so it might not work exactly as intended.

## Features

* Supports Liquid templates (requires [liquid.js by mattmccracy](https://github.com/mattmccray/liquid.js/tree/master))
* Supports GitHub Pages
* Used with JSON generated by Collection or Data file.
* Automatically populates selectors by values in entries if no defaults are provided.

## How to use

* Add Liquid.js, jQuery and jekyll-filter.js to your page's JS files.
* Generate the JSON file, this is done by creating a file like this:

```json
---
layout: none
---
{
  "template": "/ajax/company_list.html", # this is include for your entry
  "entries": [
    {% for item in site.data.companies %}
      {{ item | jsonify }}
      {% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
```

* Make sure your include is publicly readable and correct. In our example it looks like this:

```liquid
<div class="company">
	<h3>
		{% if img != null %}
			<img src="/images/company/{{ img }}">
		{% endif %}
		{% if url != null %}<a href="{{ url }}">{{ company }}</a>{% else %}{{ company }}{% endif %}: ${{ roundsize }} million - {{ round }}</h3>
	<h4>
		{{ date }} | {{ classification }}
	</h4>
	{% if description != null %}<p><b>Description:</b> {{ description }}</p>{% endif %}
	<p><b>Investors:</b> {{ investors }}</p>
	<p><b>Headquartered:</b> {{ headquartered }}</p>
	<p><b>Country:</b> {{ country }}</p>
</div>
```

* Put your desired selectors in a container with class ".filters" and surround your results with a container with class ".filters-content".

```html
<div class="filters">
  <!-- Automatically populated and ordered selector -->
  <b>Country:</b> <select id="country" data-type="country"></select></br>

  <!-- Predefined selector -->
  <b>State:</b>
    <select id="state">
      <option>All</option>
      <option>Texas</option>
      <option>Alabama</option>
      <option>Florida</option>
    </select>
</div>
<div class="filters-content">
  <!-- Here you can put a loop to display your data. The existing data will be overriden after the filter is used for the first time -->
</div>
```

* Initialize the filters on your page, this is done by calling the filter.init(dataUrl) function:

```js
filter.init('/ajax/company_list.json');
```

* You're done.
