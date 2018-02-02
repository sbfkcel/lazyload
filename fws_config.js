module.exports = {
    "author": "单炒饭",
    "mail": "liyong@4399.com",
    "projectName": "lazyload",
    "template": "default",
    "createTime": 1516707642902,
    "distReplace": {
        "*": [
            {
                "find": "feutil.localstatic.com",
                "replace": "pic.my4399.com/re/cms/feUtil"
            },
            {
                "find": "$$localhost/staticfile",
                "replace": "pic.my4399.com/re/cms/feUtil"
            }
        ]
    },
    "srcSync": {
        "targetPath": "",
        "fileType": "*"
    },
    "devSync": {
        "targetPath": "",
        "fileType": "*"
    },
    "distSync": {
        "targetPath": "",
        "fileType": "*"
    }
};