from attackcti import attack_client
import json
import re


lift = attack_client()
groups = lift.get_groups()
groups = lift.remove_revoked(groups)

json_data = {
"nodes": [],
"links": []
}

all_tools = []
all_techniques = []


def remove_dupe(group_list, verbose=False):
    """
        Sometimes certain groups turn out to be a single group
        and are then merged, resulting in duplicates with different names. 
        This is on top of `remove_revoked`, just to be safe
    """
    for idx, group in enumerate(group_list):
        group = group_list[idx]
        
        try:
            group.aliases
        except AttributeError:
            if verbose:
                print(f"[+] {group.name}: NO aliases found")

            for inner_group in group_list:
                try: 
                    if group.name in inner_group.aliases:
                        if verbose:
                            print(f"\t Found {group.name} as an alias for: {inner_group.name}\n")
                        group_list.remove(group)
                except AttributeError:
                    continue
    
    if verbose:
        print(f"[!] Done Cleaning Duplicate Groups\n")


def get_desc(md_text):
    #! Can run remove_dupe here if we really wanted
    try:
        rm_citations = re.sub(r"\(Citation([^\)]+)\)", "", md_text)
        rm_mitre_links = re.sub(r"\(https([^\)]+)\)", "", rm_citations)
        clean_desc = rm_mitre_links.translate(str.maketrans({'[':None, ']':None}))
        return clean_desc
    # In case a dupe with no desc makes it through
    except AttributeError:
        return "No Description Available Yet"  


def get_item_ids(item_list):
    return [item.external_references[0].external_id for item in item_list] 


def make_group_node(group, group_software, group_techniques, link_tool=False, 
                                link_tool_techniques=False, lift_tool_techniques=False):
    
    group_id = group.external_references[0].external_id
    group_name = group.name
    group_description = get_desc(group.description)
    node_type = "group"
    
    # For you to decide/ evaluate
    group_affiliation = ""
    group_targets = []
    group_speciality = []

    if len(group_software) > 200: # Invalid groups return a list of all 500+(all) tools
        group_val = 0
        group_tools = []
    else:
        group_tools = list(set(get_item_ids(group_software))) # To get unique tools only
        group_val = len(group_tools)

    try:
        group_aliases = group.aliases
        # We already know the group's actual name is an "alias"
        group_aliases.remove(group_name)
    except:
        group_aliases = []

    try:
        group_techniques = get_item_ids(group_techniques)
    except:
        group_techniques = []

    new_group_node = {
                "id": group_id,
                "type": node_type,
                "attributes": {
                    "val": group_val,
                    "name": group_name,
                    "aliases": group_aliases,
                    "description": group_description,
                    "tools": group_tools,
                    "techniques": group_techniques,
                    "affiliation": group_affiliation,
                    "targets": group_targets,
                    "speciality": group_speciality,
                }
            },

    json_data["nodes"] += new_group_node

    if link_tool and (len(group_software) < 150):
        for tool in group_software:
            tool_id = tool.external_references[0].external_id

            if tool_id not in all_tools:
                make_tool_node(tool, link_techniques=link_tool_techniques, lift_techniques=lift_tool_techniques)
                all_tools.append(tool_id)           

            new_link = {
                            "source": group_id,
                            "target": tool_id,
                        },

            json_data["links"] += new_link            
         

def make_tool_node(tool, link_techniques=False, lift_techniques=False):
            
    tool_name = tool.name
    tool_id = tool.external_references[0].external_id
    tool_description = get_desc(tool.description)
    node_type = "tool"

    try:
        tool_platforms = tool.x_mitre_platforms
    except:
        tool_platforms = []

    try:
        tool_labels = tool.labels
    except:
        tool_labels = []

    try:
        tool_aliases = tool.x_mitre_aliases
        # We already know the tool's actual name is an "alias"
        tool_aliases.remove(tool_name)
    except:
        tool_aliases = []

    new_tool_node = { 
                "id": tool_id,
                "type": node_type,
                "attributes": {
                    "name": tool_name,
                    "aliases": tool_aliases,
                    "labels": tool_labels,
                    "description": tool_description,
                    "platforms": tool_platforms,
                }
            },

    if lift_techniques or link_techniques:
        lift_teqs = lift.get_techniques_used_by_software(tool)

        if len(set(get_item_ids(lift_teqs))) < 100: 
            tool_technique_ids = list(set(get_item_ids(lift_teqs)))
        else:
            tool_technique_ids = []
            
        new_tool_node[0]["val"] = len(tool_technique_ids)
        new_tool_node[0]["techniques"] = tool_technique_ids

        if link_techniques:

            for technique in lift_teqs:
                technique_id = technique.external_references[0].external_id

                if technique_id not in all_techniques:
                    make_technique_node(technique)
                    all_techniques.append(technique_id)

                new_link = {
                                "source": tool_id,
                                "target": technique_id,
                            },
                json_data["links"] += new_link

    json_data["nodes"] += new_tool_node


def make_technique_node(technique):    
    technique_id = technique.external_references[0].external_id
    technique_name = technique.name
    technique_val = None
    node_type = "technique"

    try: 
        chain_phase = technique.kill_chain_phases[0].phase_name
    except: 
        chain_phase = None

    try:
        technique_description = get_desc(technique.description)
    except:
        technique_description = "No Description Available Yet"
    
    try:
        technique_detection = technique.x_mitre_detection
    except:
        technique_detection = []
    
    try:
        technique_platforms = technique.x_mitre_platforms
    except:
        technique_platforms = []
    
    try:
        is_sub_technique = technique.x_mitre_is_subtechnique
    except:
        is_sub_technique = False

    new_technique_node = { 
                "id": technique_id,
                "type": node_type,
                "attributes": {
                    "val": technique_val,
                    "name": technique_name,
                    "chain_phase": chain_phase,
                    "description": technique_detection,
                    "detection": technique_description,
                    "is_subtype": is_sub_technique,
                    "platforms": technique_platforms,
                }
            },

    json_data["nodes"] += new_technique_node


def main():
    for group in groups:
        group_software = lift.get_software_used_by_group(group)
        group_techniques = lift.get_techniques_used_by_group(group)
        make_group_node(group, group_software, group_techniques, link_tool=True)
        
        print(f"Finished Group: {group.name}")

    with open('force_graph_data.json', 'w') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4)
    

if __name__ == "__main__":
    main()