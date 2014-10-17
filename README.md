igheader
===========

This is a very small jquery plugin for a top bar which behaves like the top bar on Instagram with respect to scrolling. It basically allows for sticky section headers.

API
===

The usage is very simple.  Add this to your HTML:

```html
   <script src="http://like-falling-leaves.github.io/igheader/igheader.jquery.js"><script>
```

and then invoke it like so:

```javascript
  $('div.myroot').igheader();
```

There are no options, no default styles.  Any entries with class *header* that are children of the root element provided are considered valid headers and are cloned and copied over to the fixed bar area.

Styles for the fixed bar area can be provided by using the selector *div.bar .header* for example.  The plugin is automatically invoked on *.igheader* elements.

The plugin listens for *scroll.igheader* jQuery events on the whole window.  If this is not the right place to listen for it, you can fix it by doing the following:

```javascript

  $(function () {
     $(window).off('scroll.igheader'); // disable scroll events
     $(some_element).on('scroll', function () {
        $('div.myroot').trigger('igheader-update');
     });
  });

```

DEMO
====

Nothing is better than a live demo.  Click [here](http://like-falling-leaves.github.io/igheader/example.html) to see a demo.  If you are using Chrome on your desktop, emulate some devices and check it out.

Take a look at the styles in the HTML head of the demo to figure out how to style the header for your usecase.

MOBILE DEVICES
==============

This plugin obviously works on mobile devices but it requires [HammerJS](https://hammerjs.github.io/) to work well as mobile devices do not provide the right scroll events.  Take a look at the demo HTML to figure out how to include the required HammerJS code.

Note that while the code should work with HammerJS v1, it works much smoother on mobile devices with HammerJS v2.0.
