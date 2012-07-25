
(function ($) {

	$.fn.checkedUI = function (settings) {
		this.version = "1.0.0";
		this.plugInName = "checkedUI";

		/// <summary>
		/// Set of overrides for configing how the plug-in works
		/// </summary>
		var config = {
			// Possible variations
			//   onChkClass              offChkClass
			//   "ui-icon-check"           "ui-icon-close"
			//   "ui-icon-circle-check"    "ui-icon-circle-close"
			//                             "ui-icon-closethick"
			//   onRadClass              offRadClass
			//   ui-icon-radio-on        ui-icon-radio-off
			//   ui-icon-bullet          
			//   
			onChkClass: "ui-icon-check",
			offChkClass: "ui-icon-closethick",
			onRadClass: "ui-icon-bullet",
			offRadClass: "ui-icon-radio-off"
		}; // config

		if (settings)
		// add overrides from default settings
			$.extend(config, settings);



		/// <summary>
		/// Builds up the HTML to surround the checkbox or radio button
		/// </summary>
		function getIconHtml(chk, opts) {
			// is the checkbox currently ticked and/or disabled? 
			var isChecked = chk.is(':checked');
			var isDisabled = chk.prop("disabled");

			// locals for referencing the correct initial class state
			var startIcon = (isChecked ? opts.onClass : opts.offClass);
			var startState = "";
			if (isDisabled) {
				// disabled appearance takes precendence over checked
				startState = "ui-state-disabled";
			} else {
				startState = (isChecked ? " ui-state-active " : "");
			}

			// build up the mark up for the pseudo icon
			// ... basically we have a surrounding "inline-block" span around the icon span so we can have the background icon appear
			var icoHtml = "<span class='ui-icon " + startIcon + "' />";
			var wrapper =
				"<span " +
					"class='ui-state-default " + startState + " ui-corner-all ui-button' " +
					"style='display: inline-block; margin-right: 5px;'>" +
				icoHtml + "</span>";

			return wrapper;

		}; // getIconHtml



		/// <summary>
		/// Kind of what it says on the tin ... takes the status of the control and amends the styling
		/// of the icon and container as appropriate
		/// </summary>
		function updateUI(chk, opts) {
			var isChecked = chk.prop("checked");
			var isDisabled = chk.prop("disabled");

			opts._icon
				.toggleClass(opts.onClass, isChecked)
				.toggleClass(opts.offClass, !isChecked)
			;
			opts._box
				.toggleClass("ui-state-active", (!isDisabled && isChecked))
				.toggleClass("ui-state-disabled", isDisabled);
			;

		}; // updateUI



		/// <summary>
		/// Preps the checkbox/radio button as appropriate and wires up all events required to function
		/// </summary>
		function checkedUI(chk, opts) {
			var isRadio = chk.is(":radio");

			// wire up the correct icons to use
			opts.onClass = (isRadio ? config.onRadClass : config.onChkClass);
			opts.offClass = (isRadio ? config.offRadClass : config.offChkClass);

			if (!config.debug) {
				// hide the original checkbox (this will only exist behind the scenes)
				// ... this is configurable, purely to make future development easier
				chk.addClass("ui-helper-hidden");
			}

			// Build up the HTML to mimic the control
			var wrapper = getIconHtml(chk, opts);

			// Put the HTML just before the actual checkbox/radio button 
			// ... doesn't have to be before, could be after it's not required I just like it checkbox being afterwards :)
			chk.before(wrapper);

			// get a reference back to the inline-block span which allows the background-image to be visible
			opts._box = chk.prev();
			// ... and a reference to the icon itself (i.e. the jQuery UI "ui-icon" span)
			opts._icon = opts._box.find("span");

			var changeSelector = chk;
			if (isRadio) {
				// The incoming control, "chk" only points to a single racio/checkbox.  This is fine for checkboxes which
				// run in isolation, but radio buttons can be grouped.  So changing the value of one radio button, will
				// actually un-select others in the group.  But we won't get a "change" event for them becuase our "chk" filter
				// is only looking at one of the radio buttons in the group.
				// To fix this expand the "change" selector to include all radio buttons in the group, that way we'll get 
				// [radio button] notifications for both select and de-select scenarios.
				// Not ideal to search teh full dom, but other than _guessing_ where they are in the hierarchy there's no a great
				// deal we can do.
				changeSelector = "input[name='" + chk.attr("name") + "']";
			}
			chk.add(changeSelector).change(function () {
				updateUI(chk, opts);
			});

			// hover behaviour, note this is against the container element
			opts._box.hover(
				function () {
					if (chk.prop("disabled"))
					// shouldn't have any indication on disabled elements
						return;
					opts._box.removeClass("ui-state-active");
					opts._box.addClass("ui-state-hover");
				},
				function () {
					opts._box.removeClass("ui-state-hover");
					updateUI(chk, opts);
				}
			);

			// ... and wire up when the user clicks on the container
			opts._box.click(
				function () {
					// change the appearance of the widget given the container has been clicked
					updateUI(chk, opts);
					// propagate the click through to the underlying checkbox 
					// ... the handles any other events that have latched onto the click event of the checkbox
					// ... and honours them
					chk.click();
				}
			);

		}; // checkedUI


		// iterate over in match in the selector
		this.each(function (index) {
			var options = {};
			var me = $(this);

			checkedUI(me, options);
		});

		// maintain chainability
		return this;
	};

})(jQuery);
