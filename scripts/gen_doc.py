"""
Generate document from function docstring that registed with route decorator
in application blueprint.
"""
import json
from os import path as _path
from pprint import pprint
from string import Template

import yaml

from init import app

ROOT = _path.abspath(_path.dirname(_path.dirname(_path.realpath(__file__))))

with open(_path.join(ROOT, 'api_docs/template.md')) as f:
    template = Template(f.read())


def check_key(obj, func):
    "Ensure all keys are available"
    keys = [
        'endpoint',
        'method',
        'response',
    ]
    for key in keys:
        if obj.get(key) is None:
            raise KeyError(f'No key {key} found in {func}')


def markdown_headlink(title, header):
    return f'[{title}](#{header})'


ignore = {'static'}     # unwantted func appears in Flask view_functions
list_doc = {}           # store doc base on blueprint
endpoint_list = set()

for func_name in app.view_functions.keys():
    blueprint = func_name.split('.')[0]
    func = app.view_functions[func_name]
    if func_name not in ignore:
        if not func.__doc__:
            raise ValueError(f'Endpoint {func_name} has not been documented')
        doc = yaml.load(func.__doc__)
        check_key(doc, func_name)

        # check if there is a object in reponse, if so, it is a many-to-many
        # relationships so it needs to return as list
        for k, v in doc['response'].items():
            if type(v) is dict:
                # check again nested dict
                # for: tags in manga, manga list in result
                for vk, vv in v.items():
                    if type(vv) is dict:
                        doc['response'][k][vk] = [vv]
                doc['response'][k] = [v]

        # fill description key when `spread` into template.subtitle to avoid
        # using safe_subtitle, description is optional, because the REST
        # endpoint is self-explained in itself
        if not doc.get('description'):
            doc['description'] = ''

        # Some routes like GET routes do not need request body
        if not doc.get('param'):
            doc['param'] = ''

        # top-level array json response by dump many-to-many directly
        if doc.get('response_type') == 'array':
            doc['response'] = [doc['response']]

        # keep track of endpoint and method to avoid repeat
        key = f"{doc['endpoint']}.{doc['method']}"
        if key in endpoint_list:
            raise ValueError(f'Endpoint and method is already existed in {func_name}')
        else:
            endpoint_list.add(key)
            if not list_doc.get(blueprint):
                list_doc[blueprint] = dict()  # use dict to extract key for ToC
            list_doc[blueprint][key] = doc


for bp, docs in list_doc.items():
    # get list endpoint + method for table of content
    endpoints = sorted(docs.keys())
    # make toc
    toc = list()
    for e in endpoints:
        path, method = e.split('.')
        path_link = path.replace('/', '')  # github link don't work if link contains /
        toc_link = '- ' + markdown_headlink(f"`{path}`", path_link)
        if toc_link not in toc:
            toc.append(toc_link)
        toc.append(
            '  + ' + markdown_headlink(method, f'{method}-{path_link}')
        )

    with open(_path.join(ROOT, 'api_docs', f'{bp}.md'), 'w') as f:
        f.write('\n'.join(toc))
        f.write('\n\n')
        for e in endpoints:
            doc = docs[e]
            doc['response'] = json.dumps(doc['response'], indent=2)
            if type(doc['param']) == dict:
                # make dict in param render as table body
                doc['param'] = \
                    'param | type\n' + \
                    '--- | ---\n' + \
                    '\n'.join(f'{k} | {v}' for k, v in doc['param'].items())

            if doc.get('error'):
                error = list()
                for code, res in doc['error'].items():
                    if res.get('desc'):
                        desc = '\n' + res['desc'] + '\n'
                        del res['desc']  # so we can dump as json
                    else:
                        desc = ''

                    error.append(
                        '**{code}**\n'
                        '{desc}'
                        '```json\n'
                        '{response}\n'
                        '```'.format(code=code, desc=desc, response=json.dumps(res, indent=2))
                    )
                doc['error'] = '\n'.join(error)
            else:
                doc['error'] = ''

            f.write(template.substitute(
                **docs[e],
            ))
            f.write('\n')
