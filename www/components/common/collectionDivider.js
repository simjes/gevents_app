//Credits: http://gonehybrid.com/how-to-group-items-in-ionics-collection-repeat/
angular.module('geekeventsApp')
.directive('dividerCollectionRepeat', function($parse) {
    return {
        priority: 1001,
        compile: compile
    };

    function compile (element, attr) {
      //check if height is weird on different screen sizes. why is 120(px?) the correct number here?
        var height = attr.itemHeight || '120';
        attr.$set('itemHeight', 'event.isDivider ? 37 : ' + height);

        element.children().attr('ng-hide', 'event.isDivider');
        element.prepend(
            '<div class="item item-divider ng-hide text-center event-divider" ng-show="event.isDivider" ng-bind="event.divider"></div>'
        );
    }
});
